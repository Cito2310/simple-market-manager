import { Modal } from "../../../shared/components/Modal";
import type { ModalButton } from "../../../shared/components/Modal";
import type { TicketsModalState } from "../hooks/useTicketsModal";
import { formatTicketNumber } from "../posFormat";
import { TicketDetail } from "./TicketDetail";
import { TicketList } from "./TicketList";

interface TicketsModalProps {
    tickets: TicketsModalState;
}

export const TicketsModal = ({ tickets }: TicketsModalProps) => {
    const { selected } = tickets;

    // Imprimir todavia no esta implementado: el boton queda listo para engancharlo
    const footerButtons: ModalButton[] = selected
        ? [
              { label: "Volver", type: "secondary", onClick: tickets.backToList },
              { label: "Imprimir", type: "primary" }
          ]
        : [{ label: "Cerrar", type: "secondary", onClick: tickets.close }];

    return (
        <Modal
            title={selected ? `Ticket ${formatTicketNumber(selected._id)}` : "Ultimos tickets"}
            onClose={tickets.close}
            footerButtons={footerButtons}
        >
            {selected ? (
                <TicketDetail ticket={selected} />
            ) : (
                <TicketList tickets={tickets.tickets} onSelect={tickets.selectTicket} />
            )}
        </Modal>
    );
};
