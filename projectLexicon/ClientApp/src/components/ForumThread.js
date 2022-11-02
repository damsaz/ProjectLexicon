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
      onClose: props.onClose
    };
    this.showDetail = this.showDetail.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.showAdd = this.showAdd.bind(this);
  }

  componentDidMount() {
    this.populateData(this.state.forumCategoryId);
  }

  showDetail = (id) => {
    this.setState({ showPopup: true, popupId: id });
  }

  handleClose() {
    this.setState({ showPopup: false, popupId: 0 });
  }

  showAdd() {
    this.setState({ showPopup: true, popupId: 0 });
  }

  render() {
    return (
      <div>
        {this.state.showPopup &&
          <div className="popupBase">
            <div className="popupForm">
              <FormThreadDetail handleClose={this.handleClose} popupId={this.state.popupId} />
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
              {this.state.rows.map(x =>
                <tr key={x.id} onClick={() => this.showDetail(x.id)}>
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

