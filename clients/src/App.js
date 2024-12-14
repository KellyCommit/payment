import Transfer from "./pages/Transfer";
import { Route, Routes } from 'react-router-dom';
import TransferToOpay from "./pages/TransferToOpay";
import MonniPoint from "./pages/MonniPoint";
function App() {
  return (
    <div className="App">
      <Routes>
            <Route path="/" element={<Transfer />} />
            {/* <Route path="opay-transfer" element={<TransferToOpay/>}  />
            <Route path="/monnipoint" element={<MonniPoint/>}/> */}
        </Routes>
    </div>
  );
}

export default App;
