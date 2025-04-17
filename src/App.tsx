import './index.css';
import Button from "./components/Button.tsx";

function App() {
    const onClickButton = (): void => {
        console.log("clicked!");
    }

    return (
        <div className="min-h-screen bg-gradient">
            <h1 className="text-4xl font-bold text-blue-500">
                Hihihihi
            </h1>
            <Button
                onClick={onClickButton}>
                Click Button!
            </Button>
        </div>
    );
}

export default App;