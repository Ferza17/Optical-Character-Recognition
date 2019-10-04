import React, { Component } from 'react';
import './App.css';
import Tesseract from 'tesseract.js';

class App extends Component {

  constructor(props){
    super(props);
    this.state={
      uploads:[],
      patterns:[],
      documents:[]
    };
  }

  handleChange = (event) =>{
    //console.log(event.target.files);
    if(event.target.files){
      var uploads = [];
        for(var key in event.target.files){
          if(!event.target.files.hasOwnProperty(key)) continue;
          let upload = event.target.files[key];
          uploads.push(URL.createObjectURL(upload));
        }

        this.setState({
          uploads : uploads
        });
    }else{
      this.setState({
        uploads : []
      });
    }
  }

generateText = () =>{
  let uploads = this.state.uploads;

  

  for(var i=0;i < uploads.length; i++){
    
    Tesseract.recognize(uploads[i],'eng')
    .then(res=>{
      console.log('Data in Tesseract',res );
      // Confidence Score
      let confidence = res.confidence;

      // get text output
      let text = res.text;

      // get codes
      let pattern = /\b\w{10,10}\b/g;
      let patterns = res.text.match(pattern);

      // update state
      this.setState(({
        patterns: this.state.patterns.concat(patterns),
        documents : this.state.documents.concat({
          pattern : patterns,
          text : text,
          confidence : confidence
        })
      }))
    }).catch(err=>{
      console.log(err);
    })

  }
}


  render() {
    return (
      <div className="app">
        <header className="header">
          <h1>Optical Charecter Recognition </h1>
        </header>

        { /* File uploader */ }
        <section className="hero">
          <label className="fileUploaderContainer">
            Klik untuk upload File
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple  />
          </label>

          <div>
            { /* Previews will be shown here */ }
            
            {this.state.uploads.map((value,index)=>{
              //console.log(value);
              return <img key={index} alt={index} src={value} width="100px" />
            })}

          </div>

          <button onClick={this.generateText} className="button">Generate</button>
        </section>

        { /* Results */ }
        <section className="results">
            {this.state.documents.map((value,index)=>{
              return(
                <div key={index} className="results__result">
                  <div className="results__result__image">
                    <img width="250px" alt="result" src={this.state.uploads[index]} />
                  </div>
                  <div className="results__result__info">
                      <div className="results__result__info__codes">
                          <small>
                            <strong>Confidence Score : </strong> {value.confidence} 
                          </small>
                      </div>
                      <div className="results__result__info__codes">
                          <small>
                            <strong>Pattern output : </strong>{value.pattern.map((pattern)=>{
                              return pattern + ', ';
                            })}
                          </small>
                      </div>
                      <div className="results__result__info__text">
                          <small>
                            <strong>Full Output : </strong> {value.text}
                          </small>
                      </div>
                  </div>
                  <hr />
                </div>
                );
            })}

          <div className="results__result">
            { /* Additional output if more than one document is processed */ }
          </div>

        </section>
      </div>
    );
  }
}

export default App;
