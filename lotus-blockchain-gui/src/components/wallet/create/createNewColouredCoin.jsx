import { Trans } from '@lingui/macro';
import {
  Backdrop, Box, Button, CircularProgress, TextField, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { AlertDialog } from '@lotus/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeCreateWallet, createState, CREATE_CC_WALLET_OPTIONS
} from '../../../modules/createWallet';
import { openDialog } from '../../../modules/dialog';
import { create_cc_action } from '../../../modules/message';
import { lotus_to_graviton } from '../../../util/lotus';
import { useStyles } from './WalletCreate';


export const customStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    paddingRight: theme.spacing(3),
    height: 56,
  },
  send: {
    paddingLeft: '0px',
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(2),
    height: 56,
    width: 150,
  },
  card: {
    paddingTop: theme.spacing(10),
    height: 200,
  },
}));

export const CreateNewCCWallet = () => {
  const classes = useStyles();
  const custom = customStyles();
  const dispatch = useDispatch();
  let amount_input = null;
  let fee_input = null;
  const pending = useSelector((state) => state.create_options.pending);
  const created = useSelector((state) => state.create_options.created);

  function goBack() {
    dispatch(changeCreateWallet(CREATE_CC_WALLET_OPTIONS));
  }

  function create() {
    if (
      amount_input.value === '' ||
      Number(amount_input.value) === 0 ||
      !Number(amount_input.value) ||
      isNaN(Number(amount_input.value))
    ) {
      dispatch(
        openDialog(
          <AlertDialog>
            <Trans>
              Please enter a valid numeric amount
            </Trans>
          </AlertDialog>
        ),
      );
      return;
    }
    if (fee_input.value === '' || isNaN(Number(fee_input.value))) {
      dispatch(
        openDialog(
          <AlertDialog>
            <Trans>
              Please enter a valid numeric fee
            </Trans>
          </AlertDialog>
        ),
      );
      return;
    }
    dispatch(createState(true, true));
    const amount = lotus_to_graviton(amount_input.value);
    const fee = lotus_to_graviton(fee_input.value);
    dispatch(create_cc_action(amount, fee));
  }

  return (
    <div>
      <div className={classes.cardTitle}>
        <Box display="flex">
          <Box>
            <Button onClick={goBack}>
              <ArrowBackIosIcon> </ArrowBackIosIcon>
            </Button>
          </Box>
          <Box flexGrow={1} className={classes.title}>
            <Typography component="h6" variant="h6">
              <Trans>
                Generate New Colour
              </Trans>
            </Typography>
          </Box>
        </Box>
      </div>
      <div className={custom.card}>
        <Box display="flex">
          <Box flexGrow={1}>
            <TextField
              className={custom.input}
              id="filled-secondary" // lgtm [js/duplicate-html-id]
              variant="filled"
              color="secondary"
              fullWidth
              inputRef={(input) => {
                amount_input = input;
              }}
              label={<Trans>Amount</Trans>}
            />
          </Box>
          <Box flexGrow={1}>
            <TextField
              className={custom.input}
              id="filled-secondary"
              variant="filled"
              color="secondary"
              fullWidth
              inputRef={(input) => {
                fee_input = input;
              }}
              label={<Trans>Fee</Trans>}
            />
          </Box>
          <Box>
            <Button
              onClick={create}
              className={custom.send}
              variant="contained"
              color="primary"
            >
              <Trans>Create</Trans>
            </Button>
          </Box>
        </Box>
      </div>
      <Backdrop className={classes.backdrop} open={pending && created}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
