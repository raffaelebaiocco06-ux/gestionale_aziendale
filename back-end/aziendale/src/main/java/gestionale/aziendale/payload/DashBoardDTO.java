package gestionale.aziendale.payload;

import java.math.BigDecimal;

public record DashBoardDTO(
        BigDecimal totaleEntrate,
        BigDecimal totaleUscite,
        BigDecimal utile,
        long numeroClienti,
        long numeroFornitori,
        long numeroMezzi,
        long numeroMovimenti,
        long scadenzeImminenti,
        long scadenzeScadute
) {
}
