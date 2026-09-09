package com.store.repository;

import com.store.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    Optional<SupportTicket> findByTelegramChatIdAndStatusIn(Long chatId, List<SupportTicket.Status> statuses);
    List<SupportTicket> findAllByOrderByUpdatedAtDesc();
    long countByStatus(SupportTicket.Status status);
}
