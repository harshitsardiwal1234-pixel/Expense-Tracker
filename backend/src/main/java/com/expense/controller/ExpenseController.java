package com.expense.controller;

import com.expense.model.Expense;
import com.expense.model.User;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName()).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(Authentication authentication, @RequestParam(required = false) String category) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(expenseRepository.findByUserIdAndCategory(user.getId(), category));
        }

        return ResponseEntity.ok(expenseRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(Authentication authentication, @RequestBody Expense expense) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        expense.setUser(user);
        Expense savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(Authentication authentication, @PathVariable Long id) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Expense expense = expenseRepository.findById(id).orElse(null);
        if (expense != null && expense.getUser().getId().equals(user.getId())) {
            expenseRepository.delete(expense);
            return ResponseEntity.ok("Deleted successfully");
        }
        return ResponseEntity.badRequest().body("Expense not found or unauthorized");
    }
}
