import React, { useState, useContext } from 'react'
import shapeImage from '../../images/shape.png';
import panda from '../../images/utm.png';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import ContextFile from '../backendLogic/ContextFile';

function UtmCheckerContent(props) {

  const context = useContext(ContextFile);

  const { parseUTMParameters, setLinks } = context;

  const [autoText] = useTypewriter({
    words: ['Test UTM Params...'],
    loop: {},
    typeSpeed: 120,
    deleteSpeed: 50
  })

  const [filteredLinks, setFilteredLinks] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [emailFile, setEmailFile] = useState('');

  const [doTest, setDoTest] = useState(true);

  const utmPattern = /^(utm_source|utm_medium|utm_campaign|utm_term|utm_EmailName|Platform_Source|Date|utm_id|sfmc_id)=([^&]+)(?:&|$)/g;
  const validLinkRegex = /^https:\/\/\S+/;


  ///////////submitting the links and utm parameters here first I will validate
  ///the utm and links and further proceed with the api call
  const handleSubmit = (e) => {
    e.preventDefault();
    const validUtm = utmPattern.test(acceptanceCriteria);
    if (validUtm) {
      filteredLinks.forEach(link => {
        const isValidLink = validLinkRegex.test(link);
        if (isValidLink) {
          setDoTest(true);
        } else {
          setDoTest(false);
        }
      });
    } else {
      window.alert('Invalid UTM');
      setAcceptanceCriteria('');
      return 0;
    }
    if (doTest) {
      parseUTMParameters(acceptanceCriteria);
      //console.log(result);
    }
  }

  const handleFileChange = (files) => {
    console.log('Email file inserted and link extraction started');
    const file = files;

    if (file.name.endsWith('.htm')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const emailContent = e.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(emailContent, "text/html");
        // console.log(doc);

        // Extract and decode links from anchor tags
        const anchorTags = doc.querySelectorAll("a");
        //console.log(doc);

        ////getting the text and subject content of email and storing it into local storage to use further for content testing
        const textContent = doc.body.textContent;
        console.log(textContent);
        

        const extractedLinks = Array.from(anchorTags).map((anchor) =>
          decodeURIComponent(anchor.href)
        );
        setLinks(extractedLinks);
      };
      reader.readAsText(file);
    } else {
      window.alert('Invalid file type. Please select a .htm file.');
      setEmailFile();
    }
  };

  return (
    <>
      <div>
        <img src={shapeImage} alt="" className="shape" />
        <div className='containers' id='login-container'>
          <div className='forms-container'>
            <div className='signin-signup'>
              <div action="" className='sign-in-form'>
                <h2 className='title'><span>{autoText} </span><Cursor cursorStyle='>' cursorColor={props.dark ? '#FF6C22' : '#0D9DDA'} /></h2>
                <div className='input-field'>
                  <i className='fas fa-link'></i>
                  <input value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} name="utm parameters" type='text' placeholder='Acceptance Criteria'></input>
                </div>
                <div className='input-field emailSelector'>
                  <i className='fas fa-envelope'></i>
                  {emailFile && <label htmlFor="file-input">{emailFile.toString().slice(16, 40)}</label>}
                  {!emailFile && <label htmlFor="file-input">Click here to upload the email file</label>}
                  <input value={emailFile} onChange={(e) => { setEmailFile(e.target.value); handleFileChange(e.target.files[0]) }} id='file-input' className='emailFileSelector' accept='.htm' name="email file" type='file' placeholder='Click here to upload the email file'></input>
                </div>
                <button disabled={acceptanceCriteria === '' && emailFile === ''} className="submitBtn" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
        <div className='panels-container'>
          <div className='panel left-panel'>
            <img src={panda} className='image' alt=''></img>
          </div>
        </div>
      </div>
    </>
  )
}

export default UtmCheckerContent