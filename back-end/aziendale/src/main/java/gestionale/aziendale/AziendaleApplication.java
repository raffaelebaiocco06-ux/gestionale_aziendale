package gestionale.aziendale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AziendaleApplication {

	public static void main(String[] args) {
		SpringApplication.run(AziendaleApplication.class, args);
	}

}
