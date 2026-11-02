package com.hirehub.service;

import com.hirehub.dto.response.NotificationResponse;
import com.hirehub.entity.User;
import com.hirehub.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createNotification(User recipient, String message, NotificationType type, String linkUrl);
    Page<NotificationResponse> getUserNotifications(Pageable pageable);
    NotificationResponse markAsRead(Long notificationId);
    void markAllAsRead();
    long getUnreadCount();
}
