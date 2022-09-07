import * as React from "react";
import styles from "../../styles/ESignature.module.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Box from "@mui/material/Box";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { Button } from "@mui/material";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import BackButton from "../../components/buttons/BackButton";
import { useLocation } from "react-router-dom";
import { modules } from "../../utils/Modules";

const PdfViewer = ({ pdf }) => {
  const divREf = React.useRef(null);
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const locations = useLocation();
  const currentPath = locations.pathname;
  const index = modules.findIndex((module) => module.path === currentPath);
  const nextPath = modules[index + 1].path;
  const previousPath = modules[index - 1].path;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber((prevState) => prevState + 1);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevState) => prevState - 1);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "10px 0",
      }}
      ref={divREf}
    >
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          size="A4"
          pageNumber={pageNumber}
          width={divREf.current?.clientWidth * 0.7}
        />
      </Document>
      <p
        style={{
          marginTop: "10px",
        }}
      >
        Page {pageNumber} of {numPages}
      </p>

      <Box
        sx={{
          margin: "1rem 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {pageNumber > 1 && (
          <Button onClick={handlePrevPage} variant="outlined">
            <ChevronLeftIcon />
          </Button>
        )}
        {pageNumber < numPages && (
          <Button onClick={handleNextPage} variant="outlined">
            <ChevronRightIcon />
          </Button>
        )}
      </Box>

      {pageNumber === numPages && (
        <div className={styles.btnWrapper}>
          <PrimaryButton data="" text="Confirm & Continue" url={nextPath} />
          <BackButton text="Back" url={previousPath} />
        </div>
      )}
    </Box>
  );
};

export default PdfViewer;
