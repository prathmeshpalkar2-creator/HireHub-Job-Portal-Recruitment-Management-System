package com.hirehub.service.impl;

import com.hirehub.dto.response.NotificationResponse;
import com.hirehub.entity.Notification;
import com.hirehub.entity.User;
import com.hirehub.enums.NotificationType;
import com.hirehub.exception.ResourceNotFoundException;
import com.hirehub.exception.UnauthorizedException;
import com.hirehub.mapper.EntityDtoMapper;
import com.hirehub.repository.NotificationRepository;
import com.hirehub.repository.UserRepository;
import com.hirehub.security.UserPrincipal;
import com.hirehub.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EntityDtoMapper mapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository, EntityDtoMapper mapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    @Transactional
    public void createNotification(User recipient, String message, NotificationType type, String linkUrl) {
        Notification notification = new Notification(recipient, message, type, linkUrl);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Pageable pageable) {
        User user = getAuthenticatedUser();
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(mapper::toNotificationResponse);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User user = getAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to access this notification");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapper.toNotificationResponse(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User user = getAuthenticatedUser();
        Page<Notification> notifs = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId(), Pageable.unpaged());
        for (Notification n : notifs) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifs);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User user = getAuthenticatedUser();
        return notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());
    }
}
