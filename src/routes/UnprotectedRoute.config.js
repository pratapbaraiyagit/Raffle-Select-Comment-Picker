import { Suspense } from 'react';
import Header from 'Components/Common/Header';
import Footer from 'Components/Common/Footer';

export default function UnProtectedRoute({ children, ...rest }) {
  return (
    <>
      <Header />
      <div className="main_wrapper">
        <Suspense>{children}</Suspense>
      </div>
      <Footer />
    </>
  );
}
