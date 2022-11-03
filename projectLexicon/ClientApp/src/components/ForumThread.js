import React, { Component } from 'react';
import { Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import { FormThreadDetail } from './ForumThreadDetail';
import "./root.css";
import "./popup.css";
import { apiGet } from '../api/api';


export class ForumThread extends Component {
  static displayName = ForumThread.name;

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      loading: true,
      showPopup: false,
      popupId: 0,
      categoryName: '',
      forumCategoryId: props.forumCategoryId,
      onClose: props.onClose,
      currentThread: null
    };
    this.showDetail = this.showDetail.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.showAdd = this.showAdd.bind(this);
    this.handleAddThread = this.handleAddThread.bind(this);
    this.handleDeleteThread = this.handleDeleteThread.bind(this);
    this.handleEditThread = this.handleEditThread.bind(this);
  }

  componentDidMount() {
    this.populateData(this.state.forumCategoryId);
  }

  showDetail = (thread) => {
    this.setState({ showPopup: true, popupId: thread.id, currentThread: thread });
  }

  handleClose() {
    this.setState({ showPopup: false, popupId: 0 });
  }

  showAdd() {
    this.setState({ showPopup: true, popupId: 0, currentThread: null, forumCategoryId: this.state.forumCategoryId });
  }

  handleAddThread(newThread) {
    let rows = [...this.state.rows];
    rows.push(newThread);
    this.setState({rows})
  }

  handleDeleteThread(threadId) {
    let rows = [...this.state.rows];
    const index = rows.findIndex(t => t.id == threadId);
    if (index > -1) {
      rows.splice(index, 1);
    }
    this.setState({ rows })
  }

  handleEditThread(changedThread) {
    let rows = [...this.state.rows];
    const index = rows.findIndex(t => t.id == changedThread.id);
    if (index > -1) {
      rows[index] = { ...rows[index] , ...changedThread}
    }
    this.setState({ rows })
  }

  render() {
    return (
      <div>
        {this.state.showPopup &&
          <div className="popupBase">
            <div className="popupForm">
              <FormThreadDetail
                onAdd={this.handleAddThread}
                onChange={this.handleEditThread}
                onDelete={this.handleDeleteThread }
                handleClose={this.handleClose}
                popupId={this.state.popupId}
                thread={this.state.currentThread}
                forumCategoryId={this.state.forumCategoryId} />
            </div>
          </div>
        }
        <h1 id="tabelLabel" >Threads</h1>
        <p>Threads for category {this.state.categoryName}
        </p>
        <Button onClick={this.state.onClose} >Close</Button>
        <Button onClick={this.showAdd} >Add New</Button>
        {this.state.loading && <p><em>Loading...</em></p>}
        {!this.state.loading && (
          <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>ID</th>
                <th>Thread Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.rows.filter(x => x.forumCategoryId == this.props.forumCategoryId).map(x =>
                <tr key={x.id} onClick={() => this.showDetail(x)}>
                  <td>{x.id}</td>
                  <td>{x.name}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    );
  }



  async populateData(forumCategoryId) {
    let category = await apiGet('forumcategory/Item', { id: forumCategoryId })
    let data = await apiGet('forumthread/List', { ForumCategoryId: forumCategoryId })
    this.setState({ rows: data.result, loading: false, categoryName: category.result.name });

  }
}

