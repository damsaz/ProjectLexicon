import React, { Component } from 'react';
import { Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import { TagDetail } from './TagDetail';
import "./root.css";
import "./popup.css";


export class Tags extends Component {
  static displayName = Tags.name;

  constructor(props) {
    super(props);
    this.state = { rows: [], loading: true, showPopup: false, popupId: 0, tagPopupId: 0};
    this.showDetail = this.showDetail.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showDetail = this.showDetail.bind(this);

    this.showAdd = this.showAdd.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
  }

  // navigate = useNavigate();

  componentDidMount() {
    this.populateData();
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

  handleAddItem(newItem) {
    let rows = [...this.state.rows];
    rows.push(newItem);
    this.setState({ rows })
  }

  handleDeleteItem(itemId) {
    let rows = [...this.state.rows];
    const index = rows.findIndex(t => t.id == itemId);
    if (index > -1) {
      rows.splice(index, 1);
    }
    this.setState({ rows })
  }

  handleEditItem(changedItem) {
    let rows = [...this.state.rows];
    const index = rows.findIndex(t => t.id == changedItem.id);
    if (index > -1) {
      rows[index] = { ...rows[index], ...changedItem }
    }
    this.setState({ rows })
  }


  render() {
    // 
    return (
      <div>
        {this.state.showPopup &&
          <div className="popupBase">
            <div className="popupForm">
              <TagDetail
                handleClose={this.handleClose}
                popupId={this.state.popupId}
                onAdd={this.handleAddItem}
                onChange={this.handleEditItem}
                onDelete={this.handleDeleteItem}
                tag={{}}
              />
            </div>
          </div>
        }

        <h1 id="tabelLabel" >Tags</h1>
        <Button onClick={this.showAdd} >Add New</Button>
        {this.state.loading && <p><em>Loading...</em></p>}
        {!this.state.loading && (
          <table className='table table-striped' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tag Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.rows.map(x =>
                <tr key={x.id}>
                  <td>{x.id}</td>
                  <td>{x.name}</td>
                  <td>
                    <Button onClick={() => this.showDetail(x.id)}>Edit</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )
        }
      </div>
    );
  }



  async populateData() {
    const token = await authService.getAccessToken();
    const response = await fetch('api/tag/List', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    this.setState({ rows: data.result, loading: false });
  }
}

