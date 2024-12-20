import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderView } from 'src/sections/order/view/order-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ordens de Produto - ${CONFIG.appName}`}</title>
      </Helmet>

      <OrderView />
    </>
  );
}
