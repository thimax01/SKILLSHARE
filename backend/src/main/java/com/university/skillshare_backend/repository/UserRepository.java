package com.university.skillshare_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.university.skillshare_backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    // Find a user by username
    Optional<User> findByUsername(String username);
    
    // Find a user by email
    Optional<User> findByEmail(String email);
    
    // Find users by username containing the given string (for mention suggestions)
    List<User> findByUsernameContaining(String usernameFragment);

    // Find users by username containing the given string, ignoring case (for mention suggestions)
    List<User> findByUsernameContainingIgnoreCase(String usernameFragment);
}
