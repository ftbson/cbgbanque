import Link from "next/link";

export default function CguPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-file-contract"></i> Marco Contractual
        </span>
        <h1 className="legal-main-heading">Condiciones Generales de Uso (CGU)</h1>
        <p className="legal-lead-text">
          Modalidades aplicables a la apertura, el uso de la cuenta en línea, la emisión de tarjetas bancarias y los servicios de crédito de CBG Banco.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>Artículo 1: Objeto y Ámbito de Aplicación</h3>
            <p>
              Las presentes Condiciones Generales de Uso (las «CGU») definen las reglas y obligaciones contractuales que vinculan a toda persona física mayor de edad (el «Cliente» o «Usuario») y la sociedad <strong>CBG Banco Finance SA</strong> en el marco de la apertura y gestión de sus cuentas, instrumentos de pago y productos financieros.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artículo 2: Condiciones de Elegibilidad y Apertura de Cuenta</h3>
            <p>
              Para convertirse en cliente de CBG Banco, el solicitante debe cumplir cumulativamente las siguientes condiciones:
            </p>
            <ul>
              <li>Ser una persona física mayor de 18 años y gozar de su plena capacidad jurídica.</li>
              <li>Residir legalmente en un Estado miembro de la Unión Europea, en Suiza, en el Reino Unido o en Canadá.</li>
              <li>Facilitar una dirección de correo electrónico válida, un número de teléfono móvil operativo y completar el protocolo de verificación de identidad KYC subiendo el anverso y reverso de un documento de identidad oficial en vigor.</li>
              <li>Mencionar su situación profesional y sus ingresos mensuales con exactitud.</li>
            </ul>
            <p>
              La apertura definitiva de la cuenta está sujeta a la validación expresa por el administrador y los equipos de cumplimiento de CBG Banco. Un correo de aprobación confirma la validación de la cuenta.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artículo 3: Funcionamiento de la Cuenta y de las Tarjetas</h3>
            <p>
              La cuenta en línea permite efectuar operaciones de depósito, transferencia SEPA, consulta del saldo en tiempo real y gestión de cajas de ahorro.
            </p>
            <p>
              <strong>Tarjetas virtuales y físicas:</strong> El Cliente tiene la facultad de activar una o varias tarjetas virtuales para asegurar sus pagos en internet, o de solicitar una tarjeta física Visa. El Cliente puede en cualquier momento modificar el estado de su tarjeta (bloqueo / desbloqueo temporal), ocultar o mostrar sus números, o anular su tarjeta virtual directamente desde su espacio de cliente seguro.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artículo 4: Suscripción y Concesión de Préstamos</h3>
            <p>
              El Cliente elegible puede depositar una solicitud de préstamo personal o de financiación desde su Dashboard. Un simulador dinámico muestra el importe prestado, la duración en meses, la Tasa Anual Equivalente (TAE), el importe de las cuotas mensuales y los gastos de gestión correspondientes.
            </p>
            <p>
              El envío de una solicitud de préstamo no constituye aceptación automática: el expediente es examinado por nuestro comité de crédito. La aprobación o el rechazo de la solicitud se notifica en el Dashboard del cliente y por notificación por correo electrónico. Un crédito le compromete y debe ser reembolsado: verifique sus capacidades de reembolso antes de comprometerse.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artículo 5: Seguridad y Obligaciones del Cliente</h3>
            <p>
              El Cliente es estrictamente responsable de la confidencialidad de sus identificadores personales, de su contraseña y de sus códigos de validación temporales (OTP). Todo compartido de códigos confidenciales está formalmente prohibido. En caso de sospecha de fraude o acceso fraudulento, el Cliente debe bloquear inmediatamente sus tarjetas y contactar con el soporte de urgencia.
            </p>
          </section>

          <section className="legal-block">
            <h3>Artículo 6: Cierre de Cuenta y Resolución</h3>
            <p>
              El Cliente puede solicitar el cierre de su cuenta en cualquier momento sin preaviso ni penalización, con reserva del pago previo de todo saldo deudor o vencimiento de préstamo en curso. CBG Banco se reserva el derecho de suspender o cerrar una cuenta en caso de declaración falsa, inactividad prolongada o incumplimiento de obligaciones legales.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}