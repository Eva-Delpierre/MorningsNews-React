import React from 'react';
import './App.css';
import ScreenHome from './ScreenHome';
import ScreenArticlesBySource from './ScreenArticlesBySource';
import ScreenMyArticles from './ScreenMyArticles';
import ScreenSource from './ScreenSource';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import wishList from './reducers/articles';
import token from './reducers/token';
import selectedLang from './reducers/selectedLang';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

const store = createStore(combineReducers({wishList, token, selectedLang}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={ScreenHome} />
          <Route path="/screenarticlesbysource/:id" component={ScreenArticlesBySource} />
          <Route path="/screenmyarticles" component={ScreenMyArticles} />
          <Route path="/screensource" component={ScreenSource} />
        </Switch>
      </Router>
    </Provider>

  );
}

export default App;
