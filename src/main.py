import os

from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))

from utils.debug import getLogger

logger = getLogger(__name__)


def main():
    logger.info('main: In main {}'.format('Test'))
    logger.debug('main: 1 + 1 = {}'.format(1 + 1))
    logger.error('main: 1 + 1 != {}'.format(3))
    logger.warning('main: The software is still in development')


if __name__ == "__main__":
    main()
