package gestionale.aziendale.controller;

import gestionale.aziendale.payload.DashBoardDTO;
import gestionale.aziendale.service.DashBoardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashBoardController {

    private final DashBoardService dashBoardService;

    public DashBoardController(DashBoardService dashBoardService) {
        this.dashBoardService = dashBoardService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'OPERATORE')")
    public DashBoardDTO getDashBoard() {
        return this.dashBoardService.getDashBoard();
    }
}