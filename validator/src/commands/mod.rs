use crate::config::Config;
use clap::ArgMatches;

pub mod init;
pub mod run;

pub(crate) fn override_config(mut config: Config, matches: &ArgMatches) -> Config {
    if let Some(directory) = matches.value_of("directory") {
        config = config.with_custom_directory(directory);
    }

    config
}
