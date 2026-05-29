package gestionale.aziendale.security;

import gestionale.aziendale.entities.Utente;
import gestionale.aziendale.exception.UnauthorizedException;
import gestionale.aziendale.repository.UtenteRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class TokenFilter extends OncePerRequestFilter {

    private final TokenTools tokenTools;
    private final UtenteRepository utenteRepository;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public TokenFilter(TokenTools tokenTools, UtenteRepository utenteRepository) {
        this.tokenTools = tokenTools;
        this.utenteRepository = utenteRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException(
                    "Inserire il token nell'authorization header nel formato corretto"
            );
        }

        String accessToken = authHeader.replace("Bearer ", "");

        tokenTools.verifyToken(accessToken);

        UUID utenteId = tokenTools.extractIdFromToken(accessToken);

        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new UnauthorizedException("Utente non trovato"));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        utente,
                        null,
                        List.of(new SimpleGrantedAuthority(utente.getRuolo().name()))
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();

        return pathMatcher.match("/auth/**", path)
                || pathMatcher.match("/uploads/**", path);
    }
}
