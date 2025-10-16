import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import { Nullable } from '@/types';


const ErrorInfoBox = styled(Box)`
  border-radius: 4px;
  white-space: pre-wrap;
  padding: 10px;
  background-color: #f1f1f1;
`;

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<Nullable<string>>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorInfo(event.error ? event.error.stack : 'No stack trace available');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setErrorInfo(event.reason ? event.reason.stack : 'Unhandled rejection (no stack trace)');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('rejectionhandled', handleRejection);
    };
  }, []);

  if (hasError) {
    const formattedErrorInfo = errorInfo?.split('\n').map((line, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <p key={idx}>
        {line}
      </p>
    ));

    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <h1>Я куда то жмал и оно все сломалось :(</h1>
        <h2>Срочно звоните фиксикам</h2>
        <ErrorInfoBox>
          {formattedErrorInfo}
        </ErrorInfoBox>
      </Box>
    );
  }

  return children;
};