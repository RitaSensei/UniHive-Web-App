package org.biog.unihivebackend.service.implementation;

import java.util.List;
import java.util.UUID;

import org.biog.unihivebackend.exception.NotFoundException;
import org.biog.unihivebackend.model.Admin;
import org.biog.unihivebackend.model.School;
import org.biog.unihivebackend.model.User;
import org.biog.unihivebackend.repository.AdminRepository;
import org.biog.unihivebackend.repository.UserRepository;
import org.biog.unihivebackend.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Admin> getAll() {
        return adminRepository.findAll();
    }

    @Override
    public Admin updateAdmin(UUID id, Admin newadmin) {
        Admin oldadmin = adminRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Admin with id " + id + " not found"));
        System.out.println( oldadmin);
        User olduser = oldadmin.getUser();


        olduser.setEmail(newadmin.getUser().getEmail());
        olduser.setPassword(passwordEncoder.encode(newadmin.getUser().getPassword()));
        userRepository.save(olduser);
        oldadmin.setFirstName(newadmin.getFirstName());
        oldadmin.setLastName(newadmin.getLastName());
        return adminRepository.save(oldadmin);
    }

    @Override
    public void deleteAdmin(UUID id) {
        userRepository.deleteById(adminRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Admin with id " + id + " not found")).getUser().getId());
        adminRepository.deleteById(id);
    }

    @Override
    public Admin getAdmin(UUID id) {
        return adminRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Admin with id " + id + " not found"));
    }

    @Override
    public School getSchoolByAdmin(UUID id) {
        return adminRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Admin with id " + id + " not found")).getSchool();
    }
}