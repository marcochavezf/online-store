import {
  Button, Grid, makeStyles, Paper, TextField, Theme
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import { ChangeEventHandler, FormEvent } from 'react';
import { default as DisplayError } from '../ErrorMessage';

const authStyles = makeStyles((theme: Theme) => ({
  root: { 
    padding: 16,
    margin: 'auto',
    maxWidth: 600
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface FooterLink {
  href: string,
  label: string,
}

interface AuthLayoutProps {
  title: string,
  AvatarIcon: React.ElementType,
  error: Error,
  successMessage?: string,
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>,
  loading: boolean,
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  fields: { id: string, type: string, name: string, label: string, value: any }[],
  submitLabel: string,
  footerLinks?: { left: FooterLink, right: FooterLink },
}

export default function AuthLayout({
  title,
  AvatarIcon,
  error,
  successMessage,
  handleSubmit,
  handleChange,
  fields,
  loading,
  submitLabel,
  footerLinks,
}: AuthLayoutProps) {
  const classes = authStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AvatarIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>

        {successMessage && <p>{successMessage}</p>}

        <form className={classes.form} noValidate method="POST" onSubmit={handleSubmit}>
          {fields.map(field => (
            <TextField
              key={field.id}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id={field.id}
              name={field.name}
              label={field.label}
              autoComplete={field.name}
              type={field.type}
              autoFocus
              value={field.value}
              onChange={handleChange}
              disabled={loading}
            />)
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            {submitLabel}
          </Button>
        </form>

        {footerLinks && (
          <Grid container>
            <Grid item xs>
              <Link href={footerLinks.left.href}>
                {footerLinks.left.label}
              </Link>
            </Grid>
            <Grid item>
              <Link href={footerLinks.right.href}>
                {footerLinks.right.label}
              </Link>
            </Grid>
          </Grid>
        )}

      </Paper>
      <DisplayError error={error} />
    </div>
  )
}