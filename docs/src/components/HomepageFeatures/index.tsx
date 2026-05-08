import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Monitoreo en Tiempo Real',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Visualiza los niveles de alcohol detectados por los sensores instantáneamente
        gracias al uso de WebSockets y una arquitectura de alto rendimiento.
      </>
    ),
  },
  {
    title: 'Hardware Integrado',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Soporte para dispositivos ESP8266 y ESP32, permitiendo una fácil conexión
        con sensores MQ135 y actuadores como alertas visuales.
      </>
    ),
  },
  {
    title: 'Panel de Control Moderno',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Interfaz intuitiva construida con SvelteKit y Tailwind CSS, ofreciendo
        gráficos interactivos y gestión de usuarios segura.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
