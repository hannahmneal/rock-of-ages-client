export const AlertDialog = (showDialog, setShowDialog, title, children) => {

    return (
        <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={() => setShowDialog(false)}
            open={showDialog}
        >
            <DialogTitle
                id="alert-dialog-title"
                sx={{ backgroundColor: theme.palette.error.dark, textAlign: "center", color: theme.palette.common.white, display: "inline-flex", alignContent: "center", justifyContent: "space-between" }}

            >
                {title}
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={() => setShowDialog(false)}
                        sx={{
                            bgcolor: 'error.main',
                            borderRadius: 2,
                            color: 'primary.dark'
                        }}
                    >
                        {children}
                    </Button>
                </DialogActions>
            </DialogTitle>
            <Divider />
            <DialogContent
                sx={{
                    alignContent: 'center',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: "20vh",
                    minWidth: "50vh",
                }}
            >
                <DialogContentText
                    id="alert-dialog-description"
                    color="common.white"
                >
                    {children}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}