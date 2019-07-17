import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    height: '85vh',
    position: 'relative'
  }
}));

export const SEND_SIMPLE_EMAIL = gql`
  mutation sendSimpleEmail(
    $targetUserIds: [ID!]!
    $subject: String = ""
    $body: String = ""
  ) {
    sendSimpleEmail(
      targetUserIds: $targetUserIds
      subject: $subject
      body: $body
    )
  }
`;

export const SEND_TEMPLATE_EMAIL = gql`
  mutation sendTemplateEmail(
    $targetUserIds: [ID!]!
    $templateId: Int!
    $variables: JSON = {}
  ) {
    sendTemplateEmail(
      targetUserIds: $targetUserIds
      templateId: $templateId
      variables: $variables
    )
  }
`;

// 590261

export function TemplateEmailForm(props) {
  const { targetUsers = [] } = props;
  const [templateId, setTemplateId] = React.useState('');
  const [variables, setVariables] = React.useState('{}');
  const classes = useStyles();

  const targetUserIds = targetUsers.map(u => u.id);

  return (
    <Mutation mutation={SEND_TEMPLATE_EMAIL}>
      {(sendTemplateEmail, { loading, error, data }) => {
        return (
          <Container>
            <form
              className={classes.form}
              onSubmit={e => {
                e.preventDefault();
                sendTemplateEmail({
                  variables: {
                    templateId: +templateId,
                    variables: JSON.parse(variables),
                    targetUserIds
                  }
                });
              }}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="templateId"
                label="Template ID"
                name="templateId"
                autoComplete="templateId"
                value={templateId}
                onChange={e => setTemplateId(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="variables"
                label="Variables"
                type="variables"
                id="variables"
                rows={8}
                autoComplete="variables"
                value={variables}
                onChange={e => setVariables(e.target.value)}
              />
              <Grid container justify="flex-end" spacing={3}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        );
      }}
    </Mutation>
  );
}

export function SimpleEmailForm(props) {
  const { targetUsers = [] } = props;
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const classes = useStyles();

  const targetUserIds = targetUsers.map(u => u.id);

  return (
    <Mutation mutation={SEND_SIMPLE_EMAIL}>
      {(sendSimpleEmail, { loading, error, data }) => {
        return (
          <Container>
            <form
              className={classes.form}
              onSubmit={e => {
                e.preventDefault();
                sendSimpleEmail({
                  variables: { subject, body, targetUserIds }
                });
              }}
              noValidate
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="subject"
                label="Subject Line"
                name="subject"
                autoComplete="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                name="body"
                label="Body"
                type="body"
                id="body"
                rows={8}
                autoComplete="body"
                value={body}
                onChange={e => setBody(e.target.value)}
              />
              <Grid container justify="flex-end" spacing={3}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        );
      }}
    </Mutation>
  );
}

export default function EmailForm(props) {
  const { targetUsers = [] } = props;
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary">
        <Tab label="Simple" />
        <Tab label="Template" />
      </Tabs>
      {value === 0 && <SimpleEmailForm targetUsers={targetUsers} />}
      {value === 1 && <TemplateEmailForm targetUsers={targetUsers} />}
    </div>
  );
}
