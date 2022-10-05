import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, Typography, TextField, Grid, Alert, IconButton, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { updateMixnodeConfig } from '../../../../requests';
import { TBondedMixnode, TBondedGateway } from '../../../../context/bonding';
import { SimpleModal } from '../../../../components/Modals/SimpleModal';
import { bondedInfoParametersValidationSchema } from '../../../../components/Bonding/forms/mixnodeValidationSchema';

export const InfoSettings = ({ bondedNode }: { bondedNode: TBondedMixnode | TBondedGateway }) => {
  const [open, setOpen] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(bondedInfoParametersValidationSchema),
    mode: 'onChange',
    defaultValues: bondedNode.type === 'mixnode' ? bondedNode : {},
  });

  const onSubmit = async (data: {
    host?: string;
    version?: string;
    mixPort?: number;
    verlocPort?: number;
    httpApiPort?: number;
  }) => {
    const { host, version, mixPort, verlocPort, httpApiPort } = data;
    if (host && version && mixPort && verlocPort && httpApiPort) {
      const MixNodeConfigParams = {
        host,
        mix_port: mixPort,
        verloc_port: verlocPort,
        http_api_port: httpApiPort,
        version,
      };
      try {
        await updateMixnodeConfig(MixNodeConfigParams);
        setOpenConfirmationModal(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Grid container xs item>
      {open && (
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            px: 2,
            borderRadius: 0,
            bgcolor: 'background.default',
            color: (theme) => theme.palette.nym.nymWallet.text.blue,
            '& .MuiAlert-icon': { color: (theme) => theme.palette.nym.nymWallet.text.blue, mr: 1 },
          }}
        >
          <strong>Your changes will be ONLY saved on the display.</strong> Remember to change the values on your node’s
          config file too.
        </Alert>
      )}
      <Grid container>
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Port
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: 14,
                mb: 2,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Change profit margin of your node
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" xs={12} md={6}>
            <Grid item width={1}>
              <TextField
                {...register('mixPort')}
                name="mixPort"
                label="Mix Port"
                fullWidth
                error={!!errors.mixPort}
                helperText={errors.mixPort?.message}
              />
            </Grid>
            <Grid item width={1}>
              <TextField
                {...register('verlocPort')}
                name="verlocPort"
                label="Verloc Port"
                fullWidth
                error={!!errors.verlocPort}
                helperText={errors.verlocPort?.message}
              />
            </Grid>
            <Grid item width={1}>
              <TextField
                {...register('httpApiPort')}
                name="httpApiPort"
                label="HTTP port"
                fullWidth
                error={!!errors.httpApiPort}
                helperText={errors.httpApiPort?.message}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Host
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: 14,
                mb: 2,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Lock wallet after certain time
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" xs={12} md={6}>
            <Grid item width={1}>
              <TextField
                {...register('host')}
                name="host"
                label="host"
                fullWidth
                error={!!errors.host}
                helperText={errors.host?.message}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Version
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: 14,
                mb: 2,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Lock wallet after certain time
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" xs={12} md={6}>
            <Grid item width={1}>
              <TextField
                {...register('version')}
                name="version"
                label="Version"
                fullWidth
                error={!!errors.version}
                helperText={errors.version?.message}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid container justifyContent="end">
          <Button
            size="large"
            variant="contained"
            disabled={isSubmitting || !isDirty || !isValid}
            onClick={handleSubmit((d) => onSubmit(d))}
            type="submit"
            sx={{ m: 3, width: '320px' }}
            endIcon={isSubmitting && <CircularProgress size={20} />}
          >
            Save all display changes
          </Button>
        </Grid>
      </Grid>
      <SimpleModal
        open={openConfirmationModal}
        header="Your changes were ONLY saved on the display"
        subHeader="Remember to change the values 
        on your node’s config file too."
        okLabel="close"
        hideCloseIcon
        displayInfoIcon
        onOk={async () => {
          await setOpenConfirmationModal(false);
        }}
        buttonFullWidth
        sx={{
          width: '450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        headerStyles={{
          width: '100%',
          mb: 1,
          textAlign: 'center',
          color: theme.palette.nym.nymWallet.text.blue,
          fontSize: 16,
          textTransform: 'capitalize',
        }}
        subHeaderStyles={{
          width: '100%',
          mb: 1,
          textAlign: 'center',
          color: 'main',
          fontSize: 14,
          textTransform: 'capitalize',
        }}
      />
    </Grid>
  );
};
