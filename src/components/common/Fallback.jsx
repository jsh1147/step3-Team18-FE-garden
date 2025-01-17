import { Suspense } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

/* 사용 방법
<Fallback Loader={로더함수명} Error={에러함수명} errorMessage="에러메시지">
  <목표컴포넌트 />
</Fallback>
*/
export default function Fallback({ Loader, Error, errorMessage, children }) {
  return (
    <Suspense fallback={<Loader />}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            FallbackComponent={({ resetErrorBoundary }) => (
              <Error
                resetErrorBoundary={resetErrorBoundary}
                errorMessage={errorMessage}
              />
            )}
            onReset={reset}
          >
            {children}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}
