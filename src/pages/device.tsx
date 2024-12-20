import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DeviceView } from 'src/sections/device/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Dispositivos - ${CONFIG.appName}`}</title>
      </Helmet>

      <DeviceView />
    </>
  );
}