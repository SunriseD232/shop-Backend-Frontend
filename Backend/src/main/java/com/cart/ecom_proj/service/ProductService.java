package com.cart.ecom_proj.service;

import com.cart.ecom_proj.model.Product;
import com.cart.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;


    @Transactional
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @Transactional
    public Product getProductById(int id){
        return repo.findById(id).orElse(null);
    }

    @Transactional
    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    @Transactional
    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageDate(imageFile.getBytes());
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
        } else {
            Product existingProduct = repo.findById(id).orElse(null);
            if (existingProduct != null) {
                product.setImageDate(existingProduct.getImageDate());
                product.setImageName(existingProduct.getImageName());
                product.setImageType(existingProduct.getImageType());
            }
        }
        return repo.save(product);
    }

    @Transactional
    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    @Transactional
    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
}
