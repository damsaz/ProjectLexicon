import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
<<<<<<< Updated upstream
=======
import Messenger from './components/Chat/Messenger';
import { FetchProfil }from './components/Profil/FetchProfil';
import { ForumCategory } from './components/ForumCategory';
>>>>>>> Stashed changes
import { Counter } from './components/Counter';
import { FetchProfil } from './components/profil/FetchProfil';
import { UsersRouter } from './components/users/UsersRouter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';


import './custom.css'

export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<AuthorizeRoute path={`/fetchprofil/:userId`} component={FetchProfil} />
				<Route exact path='/' component={Home} />
				<Route path='/counter' component={Counter} />
<<<<<<< Updated upstream
				<AuthorizeRoute path='/fetch-data' component={FetchData} />
=======
				<Route path='/fetch-data' component={FetchData} />
				<Route path='/profil' component={FetchProfil} />
				<AuthorizeRoute path='/chat' component={Messenger} />
				<Route path='/forum-category' component={ForumCategory} />
>>>>>>> Stashed changes
				<AuthorizeRoute path='/users' component={UsersRouter} />
			
				<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
			</Layout>
		);
	}
}

