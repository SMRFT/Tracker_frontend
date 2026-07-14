import styled from "styled-components";

const Spinner = styled.div`
  border: 2px solid #e2e8f0;
  border-top: 2px solid var(--primary-accent);
  border-radius: 50%;
  width: ${(props) => props.size || "18px"};
  height: ${(props) => props.size || "18px"};
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Spinner;
