import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="legal-page-wrapper">
      <div className="legal-hero-banner">
        <div className="legal-hero-glow" />
        <span className="legal-pill-badge">
          <i className="fa-solid fa-scale-balanced"></i> Información Legal
        </span>
        <h1 className="legal-main-heading">Aviso Legal</h1>
        <p className="legal-lead-text">
          De conformidad con las disposiciones de las leyes europeas sobre la confianza en la economía digital y los servicios de pago.
        </p>
      </div>

      <div className="legal-page-container">
        <div className="legal-content-card">

          <section className="legal-block">
            <h3>1. Editor de la Plataforma</h3>
            <p>El sitio web y la aplicación bancaria <strong>CBG Banco</strong> son editados y explotados por:</p>
            <div className="legal-info-table">
              <div className="info-row">
                <span className="info-key">Denominación social:</span>
                <span className="info-val">CBG Banco Finance SA</span>
              </div>
              <div className="info-row">
                <span className="info-key">Forma jurídica:</span>
                <span className="info-val">Sociedad Anónima de derecho belga</span>
              </div>
              <div className="info-row">
                <span className="info-key">Capital social:</span>
                <span className="info-val">50 000 000 € totalmente liberado</span>
              </div>
              <div className="info-row">
                <span className="info-key">Domicilio social:</span>
                <span className="info-val">Avenue Louise 542, 1050 Ixelles, Bruselas, Bélgica</span>
              </div>
              <div className="info-row">
                <span className="info-key">Número de empresa (BCE):</span>
                <span className="info-val">BE 0789.456.123</span>
              </div>
              <div className="info-row">
                <span className="info-key">Identificador LEI:</span>
                <span className="info-val">549300C23BQ2026B7</span>
              </div>
              <div className="info-row">
                <span className="info-key">Código SWIFT / BIC:</span>
                <span className="info-val">C23QBEBB</span>
              </div>
              <div className="info-row">
                <span className="info-key">Correo de contacto:</span>
                <span className="info-val"><a href="mailto:contact@cbgbanque.com">contact@cbgbanque.com</a></span>
              </div>
              <div className="info-row">
                <span className="info-key">Teléfono:</span>
                <span className="info-val">+33 (0) 1 89 71 42 00</span>
              </div>
            </div>
          </section>

          <section className="legal-block">
            <h3>2. Autoridad de Control y Acreditación</h3>
            <p>
              CBG Banco Finance SA ejerce sus actividades financieras bajo la supervisión y el control prudencial de las autoridades monetarias europeas competentes y del Banco Nacional de Bélgica (BNB). Los servicios de pago y de emisión de moneda electrónica se rigen estrictamente por la Directiva Europea de Servicios de Pago (DSP2).
            </p>
          </section>

          <section className="legal-block">
            <h3>3. Alojamiento del Servicio</h3>
            <p>
              La infraestructura de alojamiento y las bases de datos de alta seguridad de CBG Banco se reparten en centros de datos europeos certificados ISO/IEC 27001, SOC 2 Tipo II y PCI-DSS nivel 1, garantizando una disponibilidad permanente del 99,99 %.
            </p>
          </section>

          <section className="legal-block">
            <h3>4. Propiedad Intelectual</h3>
            <p>
              El conjunto de elementos que componen el sitio y la aplicación (marcas CBG, logotipos, cartas gráficas, software, códigos fuentes, iconos y textos) es propiedad exclusiva de CBG Banco Finance SA u objeto de una licencia legal. Toda reproducción, copia o difusión total o parcial sin consentimiento previo por escrito queda formalmente prohibida.
            </p>
          </section>

          <section className="legal-block">
            <h3>5. Reclamación y Mediación</h3>
            <p>
              En caso de reclamación, se invita al cliente a contactar en primer lugar con el servicio de atención al cliente en <a href="mailto:reclamation@cbgbanque.com">reclamation@cbgbanque.com</a>. Si no se llega a un acuerdo, el consumidor puede recurrir gratuitamente al mediador independiente del sector financiero: <strong>Ombudsfin</strong> (<a href="https://ombudsfin.be" target="_blank" rel="noopener noreferrer">www.ombudsfin.be</a>).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}