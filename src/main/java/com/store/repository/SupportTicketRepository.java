package com.store.repository;

import com.store.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // Метод для получения всех тикетов, отсортированных по дате обновления
    List<SupportTicket> findAllByOrderByUpdatedAtDesc();

    // ЭТОТ МЕТОД КРИТИЧЕСКИ ВАЖЕН для работы статистики в админке.
    // Если его нет, будет ошибка 500.
    long countByStatus(SupportTicket.Status status);
}
