import React from 'react';
import clsx from 'clsx';
import recentDocsData from '../data/recentDocsData.json';
import styles from './HomepageFeatures/styles.module.css'; // Importa i tuoi stili

export default function RecentDocs() {
  const recentDocs = recentDocsData.slice(0, 6); // Prendi i primi 6 articoli

  return (
    <section className={styles.features}> {/* Utilizza la stessa classe della sezione Features */}
      <div className="container">
        <h2>Ultimi Articoli</h2>
        <div className="row">
          {recentDocs.map((doc, index) => (
            <div key={index} className={clsx('col col--4', styles.docCard)}> {/* Utilizza col--4 per 3 colonne */}
              <div className={styles.docCardInner}> {/* Aggiungi eventualmente altre classi CSS per il tuo card */}
                <h3><a href={doc.link}>{doc.title}</a></h3>
                <p>{doc.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

