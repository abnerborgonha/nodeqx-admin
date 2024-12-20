import { SvgColor } from 'src/components/svg-color';


// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Ordens de Produto',
    path: '/order',
    icon: icon('ic-order')
  },
  {
    title: 'Dipositivos',
    path: '/devices',
    icon: icon('ic-device'),
  }
];
