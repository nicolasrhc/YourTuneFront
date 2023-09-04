import { ConfigProvider } from 'antd';
import './App.less';
import "./styles/style.css";
import { RouterView } from './views/router/router.view';

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1DB954",
                    colorFillSecondary: "#1DB954"
                }
            }}
        >
            <RouterView />
        </ConfigProvider>
    );
}
export default App;
