import Link from "next/link";

export default function RgpdPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-user-shield"></i> Reglamento Europeo
        </span>
        <h1 className="legal-main-heading">Cumplimiento RGPD & Sus Derechos</h1>
        <p className="legal-lead-text">
          CBG Banco aplica los estándares más exigentes de la Unión Europea en materia de respeto a la vida privada y protección de datos financieros (Reglamento UE 2016/679).
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>Nuestros Compromisos Fundamentales RGPD</h3>
            <div className="rgpd-grid-highlights">
              <div className="rgpd-card-item">
                <div className="rgpd-item-icon blue">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4>Minimización de datos</h4>
                <p>Solo recopilamos la información estrictamente necesaria para la prestación de nuestros servicios bancarios y nuestras obligaciones legales.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon green">
                  <i className="fa-solid fa-key"></i>
                </div>
                <h4>Cifrado de extremo a extremo</h4>
                <p>Sus documentos de identidad y coordenadas bancarias están cifrados en reposo y en tránsito según los protocolos de punta AES-256 / TLS 1.3.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon purple">
                  <i className="fa-solid fa-ban"></i>
                </div>
                <h4>Cero reventa de datos</h4>
                <p>Sus datos personales o financieros nunca se venden, alquilan ni comercializan a terceras redes publicitarias.</p>
              </div>

              <div className="rgpd-card-item">
                <div className="rgpd-item-icon amber">
                  <i className="fa-solid fa-server"></i>
                </div>
                <h4>Alojamiento 100% Europeo</h4>
                <p>Su información se aloja en el Espacio Económico Europeo, bajo el control exclusivo de las leyes europeas.</p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Sus Derechos Individuales y Cómo Ejercerlos</h3>
            <p>El Reglamento General de Protección de Datos le confiere un conjunto de prerrogativas:</p>
            <ul>
              <li><strong>Derecho de acceso (Artículo 15 RGPD):</strong> Puede obtener la confirmación de que se tratan datos que le conciernen y recibir una copia completa.</li>
              <li><strong>Derecho de rectificación (Artículo 16 RGPD):</strong> Puede corregir o actualizar sus datos inexactos o incompletos desde su perfil o por solicitud escrita.</li>
              <li><strong>Derecho de supresión (Artículo 17 RGPD):</strong> Puede solicitar la supresión de sus datos, dentro de los límites de las obligaciones legales bancarias de conservación de archivos monetarios (duración legal de 5 años).</li>
              <li><strong>Derecho a la limitación del tratamiento (Artículo 18 RGPD):</strong> Puede solicitar la congelación temporal del tratamiento de sus datos en determinadas circunstancias.</li>
              <li><strong>Derecho a la portabilidad (Artículo 20 RGPD):</strong> Tiene derecho a recuperar sus datos financieros en un formato estructurado, de uso común y legible por máquina.</li>
              <li><strong>Derecho de oposición (Artículo 21 RGPD):</strong> Puede oponerse en cualquier momento a la utilización de sus datos con fines de prospección comercial.</li>
            </ul>
          </section>

          <section className="legal-block">
            <h3>Formulario de ejercicio de derechos RGPD</h3>
            <p>
              Para toda solicitud relativa a sus datos personales, puede dirigir su petición acompañada de una referencia de su cuenta a nuestro Delegado de Protección de Datos:
            </p>
            <div className="legal-contact-highlight">
              <i className="fa-solid fa-envelope-circle-check"></i>
              <div>
                <strong>Oficina del Delegado de Protección de Datos (DPO)</strong>
                <p>Correo dedicado: <a href="mailto:rgpd@cbgbanque.com">rgpd@cbgbanque.com</a></p>
                <p>Dirección postal: CBG Banco Finance SA, DPO Service, Avenue Louise 542, 1050 Bruselas</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#94a3b8" }}>
                  Plazo de respuesta: dentro de un mes máximo conforme al artículo 12.3 del RGPD.
                </p>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>Autoridad de Control Competente</h3>
            <p>
              Si considera que tras contactarnos sus derechos no son respetados, tiene derecho a presentar una reclamación ante la Autoridad de Protección de Datos (APD en Bélgica: <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a>) o la CNIL en Francia (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}