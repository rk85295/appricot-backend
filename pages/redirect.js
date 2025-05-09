import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectPage() {
  const router = useRouter();
  const { shop, token } = router.query;

  useEffect(() => {
    if (shop && token) {
      const deepLink = `appricot://redirect?shop=${shop}&token=${token}`;
      window.location.href = deepLink;
    }
  }, [shop, token]);

  return <p>Redirecting to mobile app...</p>;
}
