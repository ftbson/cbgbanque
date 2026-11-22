import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-lock"></i> Privacidad & Protección de Datos
        </span>
        <h1 className="legal-main-heading">Política de Privacidad</h1>
        <p className="legal-lead-text">
          Última actualización: Febrero 2026. Conozca los estrictos compromisos de CBG Banco Finance SA en cuanto a la recogida, tratamiento y seguridad de sus datos financieros y personales.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>1. Introducción y Responsable del Tratamiento</h3>
            <p>
              La presente Política de Privacidad se aplica a la totalidad de los servicios prestados por <strong>CBG Banco Finance SA</strong> (sociedad anónima de derecho europeo, domiciliada en Avenue Louise 542, 1050 Bruselas, Bélgica). En calidad de entidad financiera y responsable del tratamiento según el Reglamento General de Protección de Datos (RGPD 2016/679), concedemos una importancia primordial a la confidencialidad de su información privada.
            </p>
          </section>

          <section className="legal-block">
            <h3>2. ¿Qué datos personales recopilamos?</h3>
            <p>En el marco de la apertura y gestión de cuenta bancaria, recopilamos la siguiente información:</p>
            <ul>
              <li><strong>Datos de identificación (KYC):</strong> Tratamiento, nombre, apellidos, fecha y lugar de nacimiento, nacionalidad, dirección postal, número de teléfono y correo electrónico.</li>
              <li><strong>Documentos justificativos de identidad:</strong> Copia del anverso y reverso de su documento nacional de identidad, pasaporte o título de residencia, conservados en un espacio de almacenamiento cifrado de alta seguridad.</li>
              <li><strong>Situación profesional y financiera:</strong> Profesión declarada, tramo salarial / ingresos netos mensuales, información necesaria para la instrucción de solicitudes de préstamo.</li>
              <li><strong>Datos de transacciones y tarjetas:</strong> Número de cuenta IBAN, transferencias, creación y uso de tarjetas virtuales o físicas, historial de movimientos.</li>
              <li><strong>Datos técnicos de conexión:</strong> Marca de tiempo de conexión segura, dirección IP enmascarada, logs de auditoría para la prevención del fraude bancario.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>3. Finalidades y bases legales del tratamiento</h3>
            <p>Sus datos se tratan para objetivos precisos y lícitos:</p>
            <ul>
              <li><strong>Ejecución contractual:</strong> Creación de su cuenta, entrega de tarjetas de pago, tratamiento de transferencias, simulación y concesión de créditos.</li>
              <li><strong>Obligaciones legales y reglamentarias bancarias:</strong> Lucha contra el blanqueo de capitales y la financiación del terrorismo (LCB-FT), verificación de identidad KYC (Know Your Customer) obligatoria antes de cualquier activación de cuenta por nuestros administradores.</li>
              <li><strong>Seguridad y prevención del fraude:</strong> Protección de su espacio de cliente contra accesos no autorizados y alertas de seguridad en tiempo real.</li>
              <li><strong>Consentimiento:</strong> Para el envío de correos informativos o la activación de cookies analíticas opcionales.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>4. Duración de conservación de los datos</h3>
            <p>
              Conforme a la normativa monetaria y financiera europea, los documentos relativos a su identidad y el historial de sus operaciones se archivan durante un período de 5 años tras el cierre de la relación bancaria, tras lo cual se procede a una purga segura e irreversible.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Seguridad y Cifrado de la Información</h3>
            <p>
              Todos los datos en tránsito están protegidos por el protocolo TLS 1.3 con cifrado de 256 bits. Sus contraseñas se hash criptográficamente mediante algoritmos de clave fuerte (Argon2 / Scrypt) y nunca se almacenan en claro. Las copias de documentos de identidad solo son accesibles por el personal habilitado del servicio de Cumplimiento para verificación reglamentaria.
            </p>
          </section>

          <section className="legal-block">
            <h3>6. Sus derechos según el RGPD</h3>
            <p>
              Dispone en todo momento del derecho de acceso, rectificación, portabilidad, limitación y supresión de sus datos personales (salvo nuestras obligaciones legales bancarias de conservación). Para ejercer sus derechos, contacte con nuestro Delegado de Protección de Datos (DPO):
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <strong>Delegado de Protección de Datos (DPO)</strong>
                <p>Correo: <a href="mailto:dpo@cbgbanque.com">dpo@cbgbanque.com</a> · Dirección: CBG Banco Finance SA, DPO Office, Avenue Louise 542, 1050 Bruselas</p>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>
              Para más detalles, consulte también nuestra página dedicada al <Link href="/ES/rgpd" className="text-link">Reгламент General de Protección de Datos (RGPD)</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}