import React from "react";
import CreatableSelect from "react-select/creatable";

class EditWish extends React.Component {

  state = { title: "", description: "", user_id: "", loading: true, id: this.props.match.params.id, image:'', keywords: [], is_secret: null, is_anonymous: null};
  onInputChange = (event) => {
    const key = event.target.id;
    if (event.target?.files) {
      this.setState({
        uploadedImage: event.target.files[0]
      })
    } else {
      this.setState({
        [key]: event.target.value,
      });
    }
    // console.log(this.state)
  };

  handleSelectChange = (keywords) => {
    this.setState({keywords})
    // console.log(`Option selected:`, keywords);
    // selectedOption.forEach((option, index)=>{
    //   this.setState({[index]: option.value.word})
    // })
  }

  onFormSubmit = async (event) => {
    event.preventDefault();
    let { id, title, description, user_id, is_secret, is_anonymous, keywords, image, uploadedImage } = this.state;

    if(uploadedImage){
      const data = new FormData();
      data.append('wish[image]', uploadedImage)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wishes/image/${id}`,{
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      image = await response.text()
    }

    let clone = this.state
    delete clone.image
    delete clone.uploadedImage
    delete clone.loading
    delete clone.keywordsdata
    // console.log(clone)

    const datacopy = new FormData();
    for (let key in clone) {
      datacopy.append(`wish[${key}]`, clone[key]);
    }
    if(clone.keywords){
      clone.keywords.forEach((word,index)=>{
        datacopy.append(`wish[keyword${index+1}]`, word.label);
      })
    }    

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/wishes/${id}`, {
      method: "PUT",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: datacopy,
    });
    this.props.history.push("/wishes");
  };

  getKeywordsData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/keywords/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    this.setState({ keywordsdata: data });
    // console.log(this.state);
  };

  renderKeywords = () => {
    if (this.state.keywordsdata) {
      let keywordsarr = [];
      this.state.keywordsdata.keywords.forEach((keyword) => {
        keywordsarr.push({ value: keyword, label: keyword.word, index: keyword.id });
      });
      // console.log(keywordsarr);

      return (
        <div style={{ width: "250px" }}>
          <CreatableSelect
            value = {this.state.keywords}
            id="keyword1"
            // value={selectedValue}
            menuPlacement="auto"
            menuPosition="fixed"
            // defaultValue={[colourOptions[2], colourOptions[3]]}
            isMulti
            name="colors"
            options={keywordsarr}
            onChange={this.handleSelectChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          {/* <br />
          <b>Selected Value:</b> */}
        </div>
      );
    } else {
      return <></>;
    }
  };

  async componentDidMount() {
    const { id } = this.state;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wishes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    // console.log(data.wishes[0])
    const { title, description, user_id, is_secret, is_anonymous, keywords } = data.wishes[0]
    // console.log(keywords)
    let newkeywords = []
    keywords.forEach((word)=>{
      newkeywords.push({value:word, label:word.word, index:word.id})
    })
    this.setState({ title, user_id, description, is_anonymous, is_secret, loading: false });
    this.setState({keywords: newkeywords})
    this.getKeywordsData();
  }

  render() {
    const { title, user_id, description, is_secret, is_anonymous, loading } = this.state;
    return (
      !loading && (
        <div className="container">
          <form className="wish-form" onSubmit={this.onFormSubmit}>
            <h1>Edit a wish</h1>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={this.onInputChange}
              value={title}
            />
            {/* <label htmlFor="user_id">User ID</label>
            <input
              type="text"
              name="user_id"
              id="user_id"
              onChange={this.onInputChange}
              value={user_id}
            /> */}
            <label htmlFor="description">Description</label>
            <textarea
              className="wish-input"
              name="description"
              id="description"
              onChange={this.onInputChange}
              value={description}
            ></textarea>
            <div className="radiobutton-container">
              <label htmlFor="is_secret">Is this a secret wish? ({is_secret.toString()})</label>
              <div className="is_secret">
                <label>
                  <input
                    type="radio"
                    // checked={is_secret}
                    name="is_secret"
                    id="is_secret"
                    value="true"
                    className="form-check-input"
                    onChange={this.onInputChange}
                  />
                  true
                </label>
              </div>
              <div className="is_secret">
                <label>
                  <input
                    type="radio"
                    // checked={!is_secret}
                    name="is_secret"
                    id="is_secret"
                    value="false"
                    className="form-check-input"
                    onChange={this.onInputChange}
                  />
                  false
                </label>
              </div>
            </div>  
            <div className="radiobutton-container">
              <label htmlFor="is_anonymous">Is this an anonymous wish? ({is_anonymous.toString()})</label>
              <div className="is_anonymous">
                <label>
                  <input
                    type="radio"
                    // checked={is_anonymous}
                    name="is_anonymous"
                    id="is_anonymous"
                    value="true"
                    className="form-check-input"
                    onChange={this.onInputChange}
                  />
                  true
                </label>
              </div>
              <div className="is_anonymous">
                <label>
                  <input
                    type="radio"
                    // checked={!is_anonymous}
                    name="is_anonymous"
                    id="is_anonymous"
                    value="false"
                    className="form-check-input"
                    onChange={this.onInputChange}
                  />
                  false
                </label>
              </div>
            </div>  
            <h3>Select from existed keywords or create new keywords:</h3>

            <div className="keywordsdata-container">{this.renderKeywords()}</div>
            <br />        
            <label htmlFor="image">Image</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={this.onInputChange}
            />
            <input className="wish-submit" type="submit" data-testid="wish-submit" value="Submit" />
          </form>
        </div>
      )
    );
  }
}

export default EditWish;
