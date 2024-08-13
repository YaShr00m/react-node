import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthForm from './pages/AuthForm';
import Home from './pages/Home';
import Account from './pages/Account';
import People from './pages/People';
import {AuthProvider, useAuth} from './context/AuthContext';
import RouteHandler from './components/RouteHandler';

function Content() {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    const [isAsideOpen, setAsideOpen] = useState(false);

    const toggleAside = () => {
        setAsideOpen(!isAsideOpen);
    };

    if (!isAuthenticated && window.location.pathname !== '/login') {
        return <AuthForm/>;
    }

    return (
        <div>
            <Header toggleAside={toggleAside}/>
            <div className="main-content">
                <Sidebar isAsideOpen={isAsideOpen} toggleAside={toggleAside}/>
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        classNames="fade"
                        timeout={500}
                    >
                        <Switch location={location}>
                            <Route path="/" exact component={Home}/>
                            <Route path="/account" component={Account}/>
                            <Route path="/people" component={People}/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <RouteHandler>
                    <Content/>
                </RouteHandler>
            </AuthProvider>
        </Router>
    );
}

export default App;