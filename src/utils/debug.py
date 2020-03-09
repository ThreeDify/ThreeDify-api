import os
import sys
import logging
import datetime


def getLogLevel():
    level = getattr(logging, os.environ.get('LOG_LEVEL', 'DEBUG'), None)
    if not isinstance(level, int):
        raise ValueError('Invalid log level: {}'.format(level))

    return level


def getFormatter():
    return logging.Formatter('[%(asctime)s] [%(name)s] [%(levelname)s]: %(message)s')


def getStreamHandler():
    handler = logging.StreamHandler()

    return handler


def getFileHandler():
    filename = '{0}.log'.format(datetime.datetime.now())
    path = os.environ.get('LOG_DIR', '../logs/')
    path = os.path.join(os.path.dirname(sys.argv[0]), path)

    if not os.path.isdir(path):
        os.mkdir(os.path.abspath(path))

    handler = logging.FileHandler(os.path.join(path, filename))

    return handler


def getLogger(name):
    logger = logging.getLogger(name)

    formatter = getFormatter()

    fileHandler = getFileHandler()
    streamHandler = getStreamHandler()

    fileHandler.setFormatter(formatter)
    streamHandler.setFormatter(formatter)

    logger.addHandler(fileHandler)
    logger.addHandler(streamHandler)

    logger.setLevel(getLogLevel())

    return logger
