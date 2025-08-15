import { useEffect } from "react";
import './BotonPago.css'
export default function BotonPago() {
  useEffect(() => {
    // Cargar script de ePayco una sola vez
    const script = document.createElement("script");
    script.src = "https://checkout.epayco.co/checkout.js";
    document.body.appendChild(script);
  }, []);

  const pagar = () => {
    const handler = window.ePayco.checkout.configure({
      key: "56d5aa871350dacb73baea322d2f7cb2",
      test: true // Cambiar a false en producción
    });

    handler.open({
      amount: "50000",
      name: "Anticipo de proyecto",
      description: "Reserva para desarrollo web",
      currency: "cop",
      country: "CO",
      lang: "es",
      external: "false",
      response: "https://portfolio-two-brown-72.vercel.app/",
      confirmation: "https://portfolio-two-brown-72.vercel.app/",
    });
  };

  return (
    <button onClick={pagar}>
      <i class='bx  bx-cart'  ></i> Comprar
    </button>
  );
}

