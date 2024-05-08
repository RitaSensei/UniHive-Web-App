package org.biog.unihivebackend.service;

import org.biog.unihivebackend.model.Club;
import org.biog.unihivebackend.model.Event;
import org.biog.unihivebackend.model.School;
import org.biog.unihivebackend.model.Student;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

public interface ClubService {
    Club updateClub(UUID id, Club newclub, UUID... schoolId) throws AccessDeniedException;

    void deleteClub(UUID id, UUID... schoolId) throws AccessDeniedException;

    Club getClub(UUID id, UUID... schoolId) throws AccessDeniedException;

    List<Club> getAll(UUID... schoolId) throws AccessDeniedException;

    School getSchoolByClub(UUID id) throws AccessDeniedException;

    List<Event> getEventsByClub(UUID id, UUID... schoolId) throws AccessDeniedException;

    List<Student> getFollowers(UUID id, UUID... schoolId);
}
