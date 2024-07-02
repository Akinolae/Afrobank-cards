package com.afrobank.afrobank;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.afrobank.afrobank.mapper")
public class Application {

	public static void main(String[] args)  {
		SpringApplication.run(Application.class, args);
	}

}
