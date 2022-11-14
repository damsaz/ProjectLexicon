import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { ForumCategory } from './components/ForumCategory';
import { Events } from './components/Events';
import { Counter } from './components/Counter';
import { UsersRouter } from './components/users/UsersRouter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { Tags } from './components/Tags';
import { Forum } from './components/Forum';
import { EventList } from './components/EventList';


import './custom.css'

export default class App extends Component {
	static displayName = App.name;

	render() {
		return (
			<Layout>
				<Route exact path='/' component={Forum} />
				<Route path='/counter' component={Counter} />
				<Route path='/fetch-data' component={FetchData} />
				<Route path='/forum' component={Forum} />
				<Route path='/forum-category' component={ForumCategory} />
				<Route path='/tags' component={Tags} />
				<Route path='/community-event-list' component={EventList} />
				<Route path='/community-events' component={Events} />
				<AuthorizeRoute path='/users' component={UsersRouter} />
				<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
			</Layout>
		);
	}
}
