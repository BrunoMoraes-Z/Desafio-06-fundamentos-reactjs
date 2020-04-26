import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    console.log(uploadedFiles.length)

    if (uploadedFiles.length === 0) {
      return;
    }

    await uploadedFiles.map(file => {
      console.log(file);
      data.append('file', file.file, file.name);
    });

    console.log(data);

    try {
      // await api.post('/transactions/import', data);
      setUploadedFiles([]);
      history.goBack();
    } catch (err) {
      console.log(err.response.error);
    }
  }

  async function submitFile(files: File[]): Promise<void> {
    const props:FileProps[] = [];

    await files.map(file => {
      const prop = {
        file,
        name: file.name,
        readableSize: filesize(file.size)
      }
      props.push(prop);
    });

    setUploadedFiles(props);

    console.log(uploadedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
