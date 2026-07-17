import logging
import sys
from backend.config.settings import get_settings

settings = get_settings()

def setup_logger(name: str = "LearnPath-AI") -> logging.Logger:
    """
    Configures and returns a centralized, formatted logger for the application.
    Adjusts logging level automatically based on the DEBUG setting from environment variables.
    """
    logger = logging.getLogger(name)
    
    # Avoid attaching handlers multiple times if logger is already configured in memory
    if logger.handlers:
        return logger

    # Set logging level dynamically based on environment
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    logger.setLevel(log_level)

    # Create console handler to output to stdout (useful for Docker logs)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    # Create a standardized formatter for logs
    formatter = logging.Formatter(
        fmt="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(formatter)

    # Attach the handler to the logger
    logger.addHandler(console_handler)

    return logger

# Global default logger instance for easy importing across modules
logger = setup_logger()
